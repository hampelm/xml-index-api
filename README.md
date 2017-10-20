## Using the app

Search by name or EIN:
http://irs-xml-search.herokuapp.com/search?name=focus%20hope
http://localhost:3000/search?ein=201585919

## Dev notes

### Install

`npm install`

Also requires postgres and the data (see below)

### Run

`node server.js`

### Getting the data

Download the [IRS indexes from S3](https://aws.amazon.com/public-datasets/irs-990/).
You'll need to load them into a postgres database with the schema below.
I'd recommend using [csvkit](https://csvkit.readthedocs.io/en/1.0.2/) to get the
schema, and then loading the CSVs directly in postgres using the
[`copy ... from`](https://stackoverflow.com/questions/2987433/how-to-import-csv-file-data-into-a-postgresql-table) command.


To generate the schema:

```
head -100 index_2011.csv > clip.csv
csvsql clip.sql
```

Results in:

```
CREATE TABLE clip (
    "RETURN_ID" INTEGER NOT NULL,
    "FILING_TYPE" VARCHAR(5) NOT NULL,
    "EIN" VARCHAR(9) NOT NULL,
    "TAX_PERIOD" INTEGER NOT NULL,
    "SUB_DATE" DATE NOT NULL,
    "TAXPAYER_NAME" VARCHAR(255) NOT NULL,
    "RETURN_TYPE" VARCHAR(5) NOT NULL,
    "DLN" BIGINT NOT NULL,
    "OBJECT_ID" BIGINT NOT NULL
);
```

TSV vector full text search howto:
https://blog.lateral.io/2015/05/full-text-search-in-milliseconds-with-postgresql/
