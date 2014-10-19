package org.wdc.domain.metadata;

import javax.persistence.*;

/**
 * Created by vii on 18.10.14.
 */

@Entity
@Table(schema = "metadata", name = "artefact")
public class Artefact {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "artefact_id")
    private int artefactId;

    @Column(name = "artefact_schema")
    private String artefactSchema;


    @Column(name = "artefact_table")
    private String artefactTable;

    public Artefact() { }

    public Artefact(String artefactSchema, String artefactTable) {
        this.artefactSchema = artefactSchema;
        this.artefactTable = artefactTable;
    }

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
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        Artefact artefact = (Artefact) o;

        if (artefactId != artefact.artefactId) return false;
        if (artefactSchema != null ? !artefactSchema.equals(artefact.artefactSchema) : artefact.artefactSchema != null)
            return false;
        if (artefactTable != null ? !artefactTable.equals(artefact.artefactTable) : artefact.artefactTable != null)
            return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = artefactId;
        result = 31 * result + (artefactSchema != null ? artefactSchema.hashCode() : 0);
        result = 31 * result + (artefactTable != null ? artefactTable.hashCode() : 0);
        return result;
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
