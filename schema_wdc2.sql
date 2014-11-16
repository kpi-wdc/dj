--
-- PostgreSQL database dump
--

SET statement_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

--
-- Name: data; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA data;


ALTER SCHEMA data OWNER TO postgres;

--
-- Name: metadata; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA metadata;


ALTER SCHEMA metadata OWNER TO postgres;

--
-- Name: topology; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA topology;


ALTER SCHEMA topology OWNER TO postgres;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET search_path = data, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: object; Type: TABLE; Schema: data; Owner: postgres; Tablespace: 
--

CREATE TABLE object (
    id integer NOT NULL
);


ALTER TABLE data.object OWNER TO postgres;

--
-- Name: object_id_seq; Type: SEQUENCE; Schema: data; Owner: postgres
--

CREATE SEQUENCE object_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE data.object_id_seq OWNER TO postgres;

--
-- Name: object_id_seq; Type: SEQUENCE OWNED BY; Schema: data; Owner: postgres
--

ALTER SEQUENCE object_id_seq OWNED BY object.id;


--
-- Name: objectgroup; Type: TABLE; Schema: data; Owner: postgres; Tablespace: 
--

CREATE TABLE objectgroup (
    id integer NOT NULL
);


ALTER TABLE data.objectgroup OWNER TO postgres;

--
-- Name: objectgroup_id_seq; Type: SEQUENCE; Schema: data; Owner: postgres
--

CREATE SEQUENCE objectgroup_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE data.objectgroup_id_seq OWNER TO postgres;

--
-- Name: objectgroup_id_seq; Type: SEQUENCE OWNED BY; Schema: data; Owner: postgres
--

ALTER SEQUENCE objectgroup_id_seq OWNED BY objectgroup.id;


--
-- Name: objectgroupassoc; Type: TABLE; Schema: data; Owner: postgres; Tablespace: 
--

CREATE TABLE objectgroupassoc (
    objectgroup_id integer,
    object_id integer,
    value character varying(255),
    id integer NOT NULL
);


ALTER TABLE data.objectgroupassoc OWNER TO postgres;

--
-- Name: objectgroupassoc_id_seq; Type: SEQUENCE; Schema: data; Owner: postgres
--

CREATE SEQUENCE objectgroupassoc_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE data.objectgroupassoc_id_seq OWNER TO postgres;

--
-- Name: objectgroupassoc_id_seq; Type: SEQUENCE OWNED BY; Schema: data; Owner: postgres
--

ALTER SEQUENCE objectgroupassoc_id_seq OWNED BY objectgroupassoc.id;


SET search_path = metadata, pg_catalog;

--
-- Name: artefact; Type: TABLE; Schema: metadata; Owner: postgres; Tablespace: 
--

CREATE TABLE artefact (
    artefact_id integer NOT NULL,
    artefact_schema character varying(255),
    artefact_table character varying(255),
    key character varying(255)
);


ALTER TABLE metadata.artefact OWNER TO postgres;

--
-- Name: artefact_artefact_id_seq; Type: SEQUENCE; Schema: metadata; Owner: postgres
--

CREATE SEQUENCE artefact_artefact_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE metadata.artefact_artefact_id_seq OWNER TO postgres;

--
-- Name: artefact_artefact_id_seq; Type: SEQUENCE OWNED BY; Schema: metadata; Owner: postgres
--

ALTER SEQUENCE artefact_artefact_id_seq OWNED BY artefact.artefact_id;


--
-- Name: artefact_def; Type: TABLE; Schema: metadata; Owner: postgres; Tablespace: 
--

CREATE TABLE artefact_def (
    artefact_id integer NOT NULL,
    metadatakey_id integer NOT NULL,
    required boolean DEFAULT true,
    uniq boolean DEFAULT false,
    default_value character varying(255)
);


ALTER TABLE metadata.artefact_def OWNER TO postgres;

--
-- Name: artefactmetadata; Type: TABLE; Schema: metadata; Owner: postgres; Tablespace: 
--

CREATE TABLE artefactmetadata (
    artefact_id integer NOT NULL,
    metadatakey_id integer NOT NULL,
    value character varying(255)
);


ALTER TABLE metadata.artefactmetadata OWNER TO postgres;

--
-- Name: association; Type: TABLE; Schema: metadata; Owner: postgres; Tablespace: 
--

CREATE TABLE association (
    artefact_id integer NOT NULL,
    reference_id integer NOT NULL,
    localfield character varying(255),
    foreignfield character varying(255),
    key character varying(255)
);


ALTER TABLE metadata.association OWNER TO postgres;

--
-- Name: metadatakey; Type: TABLE; Schema: metadata; Owner: postgres; Tablespace: 
--

CREATE TABLE metadatakey (
    metadatakey_id integer NOT NULL,
    key character varying(128)
);


ALTER TABLE metadata.metadatakey OWNER TO postgres;

--
-- Name: metadatakey_def; Type: TABLE; Schema: metadata; Owner: postgres; Tablespace: 
--

CREATE TABLE metadatakey_def (
    metadatakey_id integer NOT NULL,
    def_id integer NOT NULL,
    value character varying(255)
);


ALTER TABLE metadata.metadatakey_def OWNER TO postgres;

--
-- Name: metadatakey_id_seq; Type: SEQUENCE; Schema: metadata; Owner: postgres
--

CREATE SEQUENCE metadatakey_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE metadata.metadatakey_id_seq OWNER TO postgres;

--
-- Name: metadatakey_id_seq; Type: SEQUENCE OWNED BY; Schema: metadata; Owner: postgres
--

ALTER SEQUENCE metadatakey_id_seq OWNED BY metadatakey.metadatakey_id;


--
-- Name: objectgroupmetadata; Type: TABLE; Schema: metadata; Owner: postgres; Tablespace: 
--

CREATE TABLE objectgroupmetadata (
    metadatakey_id integer,
    subject_id integer,
    value character varying(255)
);


ALTER TABLE metadata.objectgroupmetadata OWNER TO postgres;

--
-- Name: objectmetadata; Type: TABLE; Schema: metadata; Owner: postgres; Tablespace: 
--

CREATE TABLE objectmetadata (
    metadatakey_id integer,
    subject_id integer,
    value character varying(255)
);


ALTER TABLE metadata.objectmetadata OWNER TO postgres;

SET search_path = data, pg_catalog;

--
-- Name: id; Type: DEFAULT; Schema: data; Owner: postgres
--

ALTER TABLE ONLY object ALTER COLUMN id SET DEFAULT nextval('object_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: data; Owner: postgres
--

ALTER TABLE ONLY objectgroup ALTER COLUMN id SET DEFAULT nextval('objectgroup_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: data; Owner: postgres
--

ALTER TABLE ONLY objectgroupassoc ALTER COLUMN id SET DEFAULT nextval('objectgroupassoc_id_seq'::regclass);


SET search_path = metadata, pg_catalog;

--
-- Name: artefact_id; Type: DEFAULT; Schema: metadata; Owner: postgres
--

ALTER TABLE ONLY artefact ALTER COLUMN artefact_id SET DEFAULT nextval('artefact_artefact_id_seq'::regclass);


--
-- Name: metadatakey_id; Type: DEFAULT; Schema: metadata; Owner: postgres
--

ALTER TABLE ONLY metadatakey ALTER COLUMN metadatakey_id SET DEFAULT nextval('metadatakey_id_seq'::regclass);


SET search_path = data, pg_catalog;

--
-- Name: object_pkey; Type: CONSTRAINT; Schema: data; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY object
    ADD CONSTRAINT object_pkey PRIMARY KEY (id);


--
-- Name: objectgroupassoc_pkey; Type: CONSTRAINT; Schema: data; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY objectgroupassoc
    ADD CONSTRAINT objectgroupassoc_pkey PRIMARY KEY (id);


--
-- Name: pkey; Type: CONSTRAINT; Schema: data; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY objectgroup
    ADD CONSTRAINT pkey PRIMARY KEY (id);


SET search_path = metadata, pg_catalog;

--
-- Name: artefact_pkey; Type: CONSTRAINT; Schema: metadata; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY artefact
    ADD CONSTRAINT artefact_pkey PRIMARY KEY (artefact_id);


--
-- Name: artefact_u1; Type: CONSTRAINT; Schema: metadata; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY artefact
    ADD CONSTRAINT artefact_u1 UNIQUE (key);


--
-- Name: artefact_u2; Type: CONSTRAINT; Schema: metadata; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY association
    ADD CONSTRAINT artefact_u2 UNIQUE (key);


--
-- Name: key_unique; Type: CONSTRAINT; Schema: metadata; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY metadatakey
    ADD CONSTRAINT key_unique UNIQUE (key);


--
-- Name: metadatakey_pkey; Type: CONSTRAINT; Schema: metadata; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY metadatakey
    ADD CONSTRAINT metadatakey_pkey PRIMARY KEY (metadatakey_id);


--
-- Name: uniq_id_1; Type: CONSTRAINT; Schema: metadata; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY artefact_def
    ADD CONSTRAINT uniq_id_1 UNIQUE (artefact_id, metadatakey_id);


--
-- Name: uniq_id_2; Type: CONSTRAINT; Schema: metadata; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY artefactmetadata
    ADD CONSTRAINT uniq_id_2 UNIQUE (artefact_id, metadatakey_id);


--
-- Name: uniq_id_3; Type: CONSTRAINT; Schema: metadata; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY association
    ADD CONSTRAINT uniq_id_3 UNIQUE (artefact_id, reference_id);


--
-- Name: uniq_id_4; Type: CONSTRAINT; Schema: metadata; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY metadatakey_def
    ADD CONSTRAINT uniq_id_4 UNIQUE (metadatakey_id, def_id);


SET search_path = data, pg_catalog;

--
-- Name: object_fk; Type: FK CONSTRAINT; Schema: data; Owner: postgres
--

ALTER TABLE ONLY objectgroupassoc
    ADD CONSTRAINT object_fk FOREIGN KEY (object_id) REFERENCES object(id);


--
-- Name: objectgroup_fk; Type: FK CONSTRAINT; Schema: data; Owner: postgres
--

ALTER TABLE ONLY objectgroupassoc
    ADD CONSTRAINT objectgroup_fk FOREIGN KEY (objectgroup_id) REFERENCES objectgroup(id);


SET search_path = metadata, pg_catalog;

--
-- Name: artefact_fk; Type: FK CONSTRAINT; Schema: metadata; Owner: postgres
--

ALTER TABLE ONLY artefact_def
    ADD CONSTRAINT artefact_fk FOREIGN KEY (artefact_id) REFERENCES artefact(artefact_id);


--
-- Name: artefact_fk; Type: FK CONSTRAINT; Schema: metadata; Owner: postgres
--

ALTER TABLE ONLY association
    ADD CONSTRAINT artefact_fk FOREIGN KEY (artefact_id) REFERENCES artefact(artefact_id);


--
-- Name: artefact_fk; Type: FK CONSTRAINT; Schema: metadata; Owner: postgres
--

ALTER TABLE ONLY artefactmetadata
    ADD CONSTRAINT artefact_fk FOREIGN KEY (artefact_id) REFERENCES artefact(artefact_id);


--
-- Name: def_fk; Type: FK CONSTRAINT; Schema: metadata; Owner: postgres
--

ALTER TABLE ONLY metadatakey_def
    ADD CONSTRAINT def_fk FOREIGN KEY (def_id) REFERENCES metadatakey(metadatakey_id);


--
-- Name: key_fk; Type: FK CONSTRAINT; Schema: metadata; Owner: postgres
--

ALTER TABLE ONLY artefact_def
    ADD CONSTRAINT key_fk FOREIGN KEY (metadatakey_id) REFERENCES metadatakey(metadatakey_id);


--
-- Name: key_fk; Type: FK CONSTRAINT; Schema: metadata; Owner: postgres
--

ALTER TABLE ONLY metadatakey_def
    ADD CONSTRAINT key_fk FOREIGN KEY (metadatakey_id) REFERENCES metadatakey(metadatakey_id);


--
-- Name: key_fk; Type: FK CONSTRAINT; Schema: metadata; Owner: postgres
--

ALTER TABLE ONLY artefactmetadata
    ADD CONSTRAINT key_fk FOREIGN KEY (metadatakey_id) REFERENCES metadatakey(metadatakey_id);


--
-- Name: key_fk; Type: FK CONSTRAINT; Schema: metadata; Owner: postgres
--

ALTER TABLE ONLY objectmetadata
    ADD CONSTRAINT key_fk FOREIGN KEY (metadatakey_id) REFERENCES metadatakey(metadatakey_id);


--
-- Name: key_fk; Type: FK CONSTRAINT; Schema: metadata; Owner: postgres
--

ALTER TABLE ONLY objectgroupmetadata
    ADD CONSTRAINT key_fk FOREIGN KEY (metadatakey_id) REFERENCES metadatakey(metadatakey_id);


--
-- Name: reference_fk; Type: FK CONSTRAINT; Schema: metadata; Owner: postgres
--

ALTER TABLE ONLY association
    ADD CONSTRAINT reference_fk FOREIGN KEY (reference_id) REFERENCES artefact(artefact_id);


--
-- Name: subject_fk; Type: FK CONSTRAINT; Schema: metadata; Owner: postgres
--

ALTER TABLE ONLY objectmetadata
    ADD CONSTRAINT subject_fk FOREIGN KEY (subject_id) REFERENCES data.object(id);


--
-- Name: subject_fk; Type: FK CONSTRAINT; Schema: metadata; Owner: postgres
--

ALTER TABLE ONLY objectgroupmetadata
    ADD CONSTRAINT subject_fk FOREIGN KEY (subject_id) REFERENCES data.object(id);


--
-- Name: public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE ALL ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON SCHEMA public FROM postgres;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- PostgreSQL database dump complete
--

