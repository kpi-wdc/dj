package org.wdc.domain.metadata;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import javax.persistence.Id;

/**
 * Created by vii on 18.10.14.
 */

@Entity
@Table(schema = "metadata", name = "artefact")
public class Artefact {
    @Id
    @Column(name = "artefact_id")
    private int artefactId;

    @Column(name = "artefact_schema")
    private String artefactSchema;

    @Column(name = "artefact_table")
    private String artefactTable;

    public Artefact() { }

    public int getArtefactId() {
        return artefactId;
    }

    public void setArtefactId(int artefactId) {
        this.artefactId = artefactId;
    }

    public String getArtefactSchema() {
        return artefactSchema;
    }

    public void setArtefactSchema(String artefactSchema) {
        this.artefactSchema = artefactSchema;
    }

    public String getArtefactTable() {
        return artefactTable;
    }

    public void setArtefactTable(String artefactTable) {
        this.artefactTable = artefactTable;
    }

    @Override
    public String toString() {
        return "Artefact{" +
                "artefactId=" + artefactId +
                ", artefactSchema='" + artefactSchema + '\'' +
                ", artefactTable='" + artefactTable + '\'' +
                '}';
    }
}
