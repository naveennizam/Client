
## Getting Started

First, run the development server:

```bash
nodemon server.js 
# or
npx nodemon server.js 
```

In Browswer:
```bash
Open [http://localhost:8000]
```

## Postgres DB 
 #### database "auth"
 ####  Table "client"
 
 ### Table Query

 ```bash
   -- Table: public.client

-- DROP TABLE IF EXISTS public.client;

CREATE TABLE IF NOT EXISTS public.client
(
    id bigint NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 9223372036854775807 CACHE 1 ),
    name character varying COLLATE pg_catalog."default",
    email character varying COLLATE pg_catalog."default",
    provider text COLLATE pg_catalog."default",
    provider_id numeric,
    type character varying COLLATE pg_catalog."default" DEFAULT USER,
    CONSTRAINT client_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.client
    OWNER to postgres;
 ```
