import * as cheerio from 'cheerio';

export async function parseGoogleForm(formUrl) {
    try {
        const response = await fetch(formUrl);
        const html = await response.text();
        const $ = cheerio.load(html);

        // Method 1: Try to find FB_PUBLIC_LOAD_DATA_
        const scriptContent = $('script').filter((i, el) => {
            const html = $(el).html();
            return html && html.includes('FB_PUBLIC_LOAD_DATA_');
        }).html();

        if (scriptContent) {
            return parseFromScript(scriptContent, formUrl);
        }

        throw new Error('Could not find form data');
    } catch (error) {
        console.error('Error parsing form:', error);
        throw error;
    }
}

function parseFromScript(scriptContent, formUrl) {
    // Extract JSON from the variable assignment
    const match = scriptContent.match(/FB_PUBLIC_LOAD_DATA_\s*=\s*(.*?);/);
    if (!match || !match[1]) {
        throw new Error('Could not regex match FB_PUBLIC_LOAD_DATA_');
    }

    const data = JSON.parse(match[1]);

    // Structure analysis of FB_PUBLIC_LOAD_DATA_:
    // [1] = Form ID info
    // [1][1] = Form Title
    // [1][0] = Description? (check)
    // [1][1] = Title
    // [1][8] = Action URL suffix?

    /*
      The data structure is complex and undocumented, but observing common forms:
      data[1][1] -> Title
      data[1][0] -> Description
      data[1][4] -> Items List
    */

    const formTitle = data[1][8]; // or data[3]? It varies. usually [1][8] is title
    // Actually inspecting a real form often shows:
    // [1][8] is title
    // [1][0] is description

    // Let's try to be robust
    const title = data[1][8] || 'Untitled Form';
    const description = data[1][0] || '';

    // Form Action URL
    // The actual submission URL is https://docs.google.com/forms/u/0/d/[FORM_ID]/formResponse
    // We can derive it from the passed formUrl
    // formUrl likely looks like https://docs.google.com/forms/d/e/[ID]/viewform
    // We need to change 'viewform' to 'formResponse'
    const actionUrl = formUrl.replace('viewform', 'formResponse');

    const rawFields = data[1][1];
    const fields = [];

    if (rawFields) {
        rawFields.forEach(item => {
            // Item structure:
            // [0] = ID
            // [1] = Label
            // [2] = Description (sublabel)
            // [3] = Type ID?
            // [4] = Options/Validation configuration (Array)

            /*
              Type IDs (observed):
              0: Short Answer
              1: Paragraph
              2: Multiple Choice
              3: Dropdown
              4: Checkboxes
              
              The input name is usually inside item[4][0][0] -> as an int ID like 123456
              Entry name is entry.123456
            */

            if (!item[1]) return; // Skip if no label (maybe layout item)

            const label = item[1];
            const helpText = item[2];
            const typeId = item[3];

            let type = 'text';
            let options = [];
            let entryId = null;
            let required = false;

            // Extract entry ID
            // Usually in item[4][0][0]
            if (item[4] && item[4][0] && item[4][0][0]) {
                entryId = item[4][0][0];
            }

            // required status
            // item[4][0][2] == 1 ?
            if (item[4] && item[4][0] && item[4][0][2] === 1) {
                required = true;
            }

            switch (typeId) {
                case 0: type = 'short_text'; break;
                case 1: type = 'long_text'; break;
                case 2:
                    type = 'radio';
                    // Options are in item[4][0][1]
                    if (item[4][0][1]) {
                        options = item[4][0][1].map(o => o[0]).filter(o => o);
                    }
                    break;
                case 3:
                    type = 'dropdown';
                    if (item[4][0][1]) {
                        options = item[4][0][1].map(o => o[0]).filter(o => o);
                    }
                    break;
                case 4:
                    type = 'checkbox';
                    if (item[4][0][1]) {
                        options = item[4][0][1].map(o => o[0]).filter(o => o);
                    }
                    break;
                default: type = 'unknown';
            }

            if (entryId) {
                fields.push({
                    id: entryId,
                    name: `entry.${entryId}`,
                    label,
                    helpText,
                    type,
                    options,
                    required
                });
            }
        });
    }

    return {
        title,
        description,
        action: actionUrl,
        fields
    };
}
