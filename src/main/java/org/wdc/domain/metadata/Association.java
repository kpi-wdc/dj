package org.wdc.domain.metadata;

import org.wdc.domain.metadata.ids.AssociationId;

import javax.persistence.*;

@Entity
@Table(schema = "metadata", name = "association")
@AssociationOverrides({
        @AssociationOverride(name = "pk.artefact",
                joinColumns = @JoinColumn(name = "artefact_id")),
        @AssociationOverride(name = "pk.reference",
                joinColumns = @JoinColumn(name = "reference_id"))
})
public class Association {
    @EmbeddedId
    private AssociationId pk = new AssociationId();

    @Column(name = "localfield")
    private String localField;

    @Column(name = "foreignfield")
    private String foreignField;

    @Column(name = "key")
    private String key;

    public Association() { }

    public Association(String localField, String foreignField) {
        this.localField = localField;
        this.foreignField = foreignField;
    }

    public Association(String localField, String foreignField, String key) {
        this.localField = localField;
        this.foreignField = foreignField;
        this.key = key;
    }

    @Transient
    public Artefact getArtefact() {
        return getPk().getArtefact();
    }

    public void setArtefact(Artefact artefact) {
        getPk().setArtefact(artefact);
    }

    @Transient
    public Artefact getReference() {
        return getPk().getReference();
    }

    public void setForeignField(Artefact foreignField) {
        getPk().setArtefact(foreignField);
    }

    public AssociationId getPk() {
        return pk;
    }

    public void setPk(AssociationId pk) {
        this.pk = pk;
    }

    public String getLocalField() {
        return localField;
    }

    public void setLocalField(String localField) {
        this.localField = localField;
    }

    public String getForeignField() {
        return foreignField;
    }

    public void setForeignField(String foreignField) {
        this.foreignField = foreignField;
    }

    public String getKey() {
        return key;
    }

    public void setKey(String key) {
        this.key = key;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        Association that = (Association) o;

        if (foreignField != null ? !foreignField.equals(that.foreignField) : that.foreignField != null) return false;
        if (key != null ? !key.equals(that.key) : that.key != null) return false;
        if (localField != null ? !localField.equals(that.localField) : that.localField != null) return false;
        if (pk != null ? !pk.equals(that.pk) : that.pk != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = pk != null ? pk.hashCode() : 0;
        result = 31 * result + (localField != null ? localField.hashCode() : 0);
        result = 31 * result + (foreignField != null ? foreignField.hashCode() : 0);
        result = 31 * result + (key != null ? key.hashCode() : 0);
        return result;
    }

    @Override
    public String toString() {
        return "Association{" +
                "artefact=" + getArtefact() +
                ", reference=" + getReference() +
                ", localField='" + localField + '\'' +
                ", foreignField='" + foreignField + '\'' +
                ", key='" + key + '\'' +
                '}';
    }
}