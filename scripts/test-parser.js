
// Mock CHEERIO and internal logic testing

// Updated Mock Data to match standard Google Form structure:
// data[1][0] = Description
// data[1][1] = Fields Array
// data[1][8] = Title
const mockScriptContent = `
var FB_PUBLIC_LOAD_DATA_ = [null,["Test Form Description",[[101,"Name Field",null,0,[[123456,null,0]]],[102,"Choice Field",null,2,[[654321,[["Option 1"],["Option 2"]],0]]]],null,null,null,null,null,null,"Test Form Title",null,[123,456],0,null,null,null],null,null,null,null,null,null,null,null,null,null,[2]];
`;

function testParser() {
    console.log("Running Parser Test on Mock Data...");

    try {
        const match = mockScriptContent.match(/FB_PUBLIC_LOAD_DATA_\s*=\s*(.*?);/);
        if (!match) throw new Error("Regex failed");

        const data = JSON.parse(match[1]);

        // Validate key fields
        const title = data[1][8];
        if (title !== "Test Form Title") throw new Error(`Title mismatch: ${JSON.stringify(title)}`);

        const fieldsRaw = data[1][1];
        const fields = fieldsRaw.map(item => {
            // item[4][0][0] is ID
            const id = item[4] && item[4][0] ? item[4][0][0] : null;
            const label = item[1];
            const typeId = item[3];
            return { id, label, typeId };
        });

        if (fields.length !== 2) throw new Error("Incorrect field count");
        if (fields[0].label !== "Name Field") throw new Error("Field 1 label mismatch");
        if (fields[1].typeId !== 2) throw new Error("Field 2 type mismatch");

        console.log("✅ Parser Logic Verified Successfully!");
        console.log("Parsed Title:", title);
        console.log("Parsed Fields:", fields);

    } catch (e) {
        console.error("❌ Test Failed:", e);
        process.exit(1);
    }
}

testParser();
