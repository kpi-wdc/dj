package org.wdc.domain.metadata;

import javax.persistence.*;

@Entity
@Table(schema = "metadata", name = "artefactmetadata")
@AssociationOverrides({
        @AssociationOverride(name = "pk.artefact",
                joinColumns = @JoinColumn(name = "artefact_id")),
        @AssociationOverride(name = "pk.metadataKey",
                joinColumns = @JoinColumn(name = "metadatakey_id"))
})
public class ArtefactMetadata {
    @EmbeddedId
    private ArtefactMetadataId pk = new ArtefactMetadataId();

    @Column(name = "value")
    private String value;

    public ArtefactMetadata() { }

    public ArtefactMetadataId getPk() {
        return pk;
    }

    public void setPk(ArtefactMetadataId pk) {
        this.pk = pk;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        ArtefactMetadata that = (ArtefactMetadata) o;

        if (pk != null ? !pk.equals(that.pk) : that.pk != null) return false;
        if (value != null ? !value.equals(that.value) : that.value != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = pk != null ? pk.hashCode() : 0;
        result = 31 * result + (value != null ? value.hashCode() : 0);
        return result;
    }

    @Override
    public String toString() {
        return "ArtefactMetadata{" +
                "pk=" + pk +
                ", value='" + value + '\'' +
                '}';
    }
}