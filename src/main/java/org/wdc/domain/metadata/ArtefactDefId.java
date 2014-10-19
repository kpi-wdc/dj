package org.wdc.domain.metadata;

import javax.persistence.Embeddable;
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;
import java.io.Serializable;

/**
 * Created by vii on 19.10.14.
 */

@Embeddable
public class ArtefactDefId implements Serializable {
    @ManyToOne
    private Artefact artefact;

    @ManyToOne
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
}
