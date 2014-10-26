package org.wdc.domain.metadata.ids;

import org.wdc.domain.metadata.Artefact;
import org.wdc.domain.metadata.MetadataKey;

import javax.persistence.Embeddable;
import javax.persistence.ManyToOne;
import java.io.Serializable;

/**
 * Represents composite key for ArtefactDef intermediate table
 * that connects Artefact and Metadatakey tables in many-to-many
 * relation
 */
@Embeddable
public class ArtefactDefId implements Serializable {
    @ManyToOne
    @SuppressWarnings("all")
    private Artefact artefact;

    @ManyToOne
    @SuppressWarnings("all")
    private MetadataKey metadataKey;

    public Artefact getArtefact() {
        return artefact;
    }

    public void setArtefact(Artefact artefact) {
        this.artefact = artefact;
    }

    public MetadataKey getMetadataKey() {
        return metadataKey;
    }

    public void setMetadataKey(MetadataKey metadataKey) {
        this.metadataKey = metadataKey;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        ArtefactDefId that = (ArtefactDefId) o;

        if (artefact != null ? !artefact.equals(that.artefact) : that.artefact != null) return false;
        if (metadataKey != null ? !metadataKey.equals(that.metadataKey) : that.metadataKey != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = artefact != null ? artefact.hashCode() : 0;
        result = 31 * result + (metadataKey != null ? metadataKey.hashCode() : 0);
        return result;
    }

    @Override
    public String toString() {
        return "ArtefactDefId{" +
                "artefact=" + artefact +
                ", metadataKey=" + metadataKey +
                '}';
    }
}
