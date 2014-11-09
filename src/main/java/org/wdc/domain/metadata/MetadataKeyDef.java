package org.wdc.domain.metadata;


import org.wdc.domain.metadata.ids.MetadataKeyDefId;

import javax.persistence.*;

@Entity
@Table(schema = "metadata", name = "metadatakey_def")
@AssociationOverrides({
        @AssociationOverride(name = "pk.metadataKey",
                joinColumns = @JoinColumn(name = "metadatakey_id")),
        @AssociationOverride(name = "pk.def",
                joinColumns = @JoinColumn(name = "def_id"))
})
public class MetadataKeyDef {
    @EmbeddedId
    private MetadataKeyDefId pk = new MetadataKeyDefId();

    @Column(name = "value")
    private String value;

    public MetadataKeyDef() { }

    public MetadataKeyDef(MetadataKeyDefId pk) {
        this.pk = pk;
    }

    public MetadataKeyDef(MetadataKeyDefId pk, String value) {
        this.pk = pk;
        this.value = value;
    }

    @Transient
    public MetadataKey getMetadataKey() {
        return getPk().getMetadataKey();
    }

    public void setMetadataKey(MetadataKey metadataKey) {
        getPk().setMetadataKey(metadataKey);
    }

    @Transient
    public MetadataKey getDef() {
        return getPk().getDef();
    }

    public void setDef(MetadataKey def) {
        getPk().setDef(def);
    }

    public MetadataKeyDefId getPk() {
        return pk;
    }

    public void setPk(MetadataKeyDefId pk) {
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

        MetadataKeyDef that = (MetadataKeyDef) o;

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
        return "MetadataKeyDef{" +
                "value='" + value + '\'' +
                '}';
    }
}