package org.wdc.domain.metadata.ids;

import org.wdc.domain.metadata.Artefact;

import javax.persistence.Embeddable;
import javax.persistence.ManyToOne;
import java.io.Serializable;

@Embeddable
public class AssociationId implements Serializable {
    @ManyToOne
    @SuppressWarnings("all")
    private Artefact artefact;

    @ManyToOne
    @SuppressWarnings("all")
    private Artefact reference;

    public AssociationId() { }

    public AssociationId(Artefact artefact, Artefact reference) {
        this.artefact = artefact;
        this.reference = reference;
    }

    public Artefact getArtefact() {
        return artefact;
    }

    public void setArtefact(Artefact artefact) {
        this.artefact = artefact;
    }

    public Artefact getReference() {
        return reference;
    }

    public void setReference(Artefact reference) {
        this.reference = reference;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        AssociationId that = (AssociationId) o;

        if (artefact != null ? !artefact.equals(that.artefact) : that.artefact != null) return false;
        if (reference != null ? !reference.equals(that.reference) : that.reference != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = artefact != null ? artefact.hashCode() : 0;
        result = 31 * result + (reference != null ? reference.hashCode() : 0);
        return result;
    }
}