package org.wdc.domain.metadata;

import org.wdc.domain.metadata.ids.ArtefactDefId;

import javax.persistence.*;

@Entity
@Table(schema = "metadata", name = "artefact_def")
@AssociationOverrides({
        @AssociationOverride(name = "pk.artefact",
                joinColumns = @JoinColumn(name = "artefact_id")),
        @AssociationOverride(name = "pk.metadataKey",
                joinColumns = @JoinColumn(name = "metadatakey_id"))
})
public class ArtefactDef {
    @EmbeddedId
    private ArtefactDefId pk = new ArtefactDefId();

    @Column(name = "required")
    private boolean required;

    @Column(name = "unique")
    private boolean unique;

    @Column(name = "default_value")
    private String defaultValue;

    public ArtefactDef() { }

    public ArtefactDef(boolean required, boolean unique, String defaultValue) {
        this.required = required;
        this.unique = unique;
        this.defaultValue = defaultValue;
    }

    public ArtefactDef(boolean required, boolean unique) {
        this.required = required;
        this.unique = unique;
    }

    @Transient
    public Artefact getArtefact() {
        return getPk().getArtefact();
    }

    public void setArtefact(Artefact artefact) {
        getPk().setArtefact(artefact);
    }

    @Transient
    public MetadataKey getMetadataKey() {
        return getPk().getMetadataKey();
    }

    public void setMetadataKey(MetadataKey metadataKey) {
        getPk().setMetadataKey(metadataKey);
    }

    public ArtefactDefId getPk() {
        return pk;
    }

    public void setPk(ArtefactDefId pk) {
        this.pk = pk;
    }

    public boolean isRequired() {
        return required;
    }

    public void setRequired(boolean required) {
        this.required = required;
    }

    public boolean isUnique() {
        return unique;
    }

    public void setUnique(boolean unique) {
        this.unique = unique;
    }

    public String getDefaultValue() {
        return defaultValue;
    }

    public void setDefaultValue(String defaultValue) {
        this.defaultValue = defaultValue;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        ArtefactDef that = (ArtefactDef) o;

        if (required != that.required) return false;
        if (unique != that.unique) return false;
        if (defaultValue != null ? !defaultValue.equals(that.defaultValue) : that.defaultValue != null) return false;
        if (pk != null ? !pk.equals(that.pk) : that.pk != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = pk != null ? pk.hashCode() : 0;
        result = 31 * result + (required ? 1 : 0);
        result = 31 * result + (unique ? 1 : 0);
        result = 31 * result + (defaultValue != null ? defaultValue.hashCode() : 0);
        return result;
    }

    @Override
    public String toString() {
        return "ArtefactDef{" +
                "required=" + required +
                ", unique=" + unique +
                ", defaultValue='" + defaultValue + '\'' +
                '}';
    }
}
