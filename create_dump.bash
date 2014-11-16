#! /bin/bash

# dump schema
pg_dump wdc2 -s > schema_wdc2.sql

#dump data
pg_dump wdc2 -a > data_wdc2.sql 