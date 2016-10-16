IRS 990 XML Data Index API

Jeez that's a long name. 


Data is in /tmp/xml

To get schema:
head -100 index_2011.csv > clip.csv
csvsql clip.sql

Results in

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

TSV vector full text search:
https://blog.lateral.io/2015/05/full-text-search-in-milliseconds-with-postgresql/
