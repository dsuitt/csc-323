const {BigQuery} = require('@google-cloud/bigquery');
const bigquery = new BigQuery();

const functions = require('@google-cloud/functions-framework');

functions.http('helloBigQuery', async (req, res) => {
  // Define the SQL query

  const sqlQuery = `
      SELECT word, word_count
            FROM \`bigquery-public-data.samples.shakespeare\`
            WHERE corpus = romeoandjuliet
            AND word_count >= 400
            ORDER BY word_count DESC`;

  const options = {
    query: sqlQuery,
    // Location must match that of the dataset referenced in the query.
    location: 'US',
  };

  // Execute the query
  try {
    const [rows] = await bigquery.query(options);
    res.status(200).send(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send(`Error querying BigQuery: ${err}`);
  }
});

// To call the function use the following curl command:
// curl -X POST http://localhost:8080/helloBigQuery