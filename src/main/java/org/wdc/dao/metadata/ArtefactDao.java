package org.wdc.dao.metadata;

import org.wdc.domain.metadata.Artefact;

import java.util.List;

/**
 * Created by vii on 18.10.14.
 */
public interface ArtefactDao {
    public List<Artefact> getArtefacts();
    public void add(Artefact artefact);
}
