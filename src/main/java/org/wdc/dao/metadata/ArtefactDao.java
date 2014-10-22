package org.wdc.dao.metadata;

import org.wdc.domain.metadata.Artefact;

import java.util.List;

public interface ArtefactDao {
    public List<Artefact> getArtefacts();
    public void add(Artefact artefact);
}
