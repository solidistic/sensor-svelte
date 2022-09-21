import { CSVToJSON } from "./csv-to-json"

export const fetchDatabaseData = async (range = "-7d") => {
    const orgId = import.meta.env.VITE_ORG_ID;
    const token = import.meta.env.VITE_API_TOKEN;
    const bucket = import.meta.env.VITE_BUCKET;
    const endpoint = "query"
    const url = `https://eu-central-1-1.aws.cloud2.influxdata.com/api/v2/${endpoint}?org=${orgId}`
    const query = `
        from(bucket: "${bucket}")
            |> range(start: ${range})
            |> filter(fn: (r) => r["_measurement"] == "project")
        `
    const options = {
        method: "POST",
        headers: {
            "Accept": "application/csv",
            "Authorization": `Token ${token}`,
            "Content-Type": "application/vnd.flux",
        },
        body: query
    };

    const response = await fetch(url, options);
    const reader = response.body.getReader();
    const stream = await new ReadableStream({
        start(controller) {
            function push() {
                reader.read().then(({ done, value }) => {
                    if (done) {
                        // console.log('done', done);
                        controller.close();
                        return;
                    }
                    controller.enqueue(value);
                    // console.log(done, value);
                    push();
                })
            }

            push();
        }
    });

    return CSVToJSON(await new Response(stream, { headers: { "Content-Type": "text/html" } }).text())
}

export const filterByTable = (data) => {
    const tables = {};

    for (let i = 0; i < data.length; i++) {
        const item = data[i];
        const key = item._field;

        if (typeof key !== "string") continue;

        if (!tables.hasOwnProperty(key)) {
            tables[key] = {
                tableId: item.table,
                data: []
            }
        }

        const dataObj = {
            value: item._value,
            time: item._time
        }

        tables[key].data.push(dataObj);
    }

    return tables;
}