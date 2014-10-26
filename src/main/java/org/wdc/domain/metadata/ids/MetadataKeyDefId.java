package org.wdc.domain.metadata.ids;

import org.wdc.domain.metadata.MetadataKey;

import javax.persistence.Embeddable;
import javax.persistence.ManyToOne;
import java.io.Serializable;

@Embeddable
public class MetadataKeyDefId implements Serializable {
    @ManyToOne
    @SuppressWarnings("all")
    private MetadataKey metadataKey;

    @ManyToOne
    @SuppressWarnings("all")
    private MetadataKey def;

    public MetadataKeyDefId() { }

    public MetadataKey getMetadataKey() {
        return metadataKey;
    }

    public void setMetadataKey(MetadataKey metadataKey) {
        this.metadataKey = metadataKey;
    }

    public MetadataKey getDef() {
        return def;
    }

    public void setDef(MetadataKey def) {
        this.def = def;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        MetadataKeyDefId that = (MetadataKeyDefId) o;

        if (def != null ? !def.equals(that.def) : that.def != null) return false;
        if (metadataKey != null ? !metadataKey.equals(that.metadataKey) : that.metadataKey != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = metadataKey != null ? metadataKey.hashCode() : 0;
        result = 31 * result + (def != null ? def.hashCode() : 0);
        return result;
    }
}