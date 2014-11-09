package org.wdc.service;

import org.wdc.domain.metadata.Artefact;

import java.util.List;

public interface ArtefactService {
    public void addArtefactRow(String key, String schema, String table);
    public void addArtefact(Artefact artefact);
    public void updateArtefactRow(String key, String newSchema, String newTable);
    public void updateArtefact(Artefact artefact);
    public void removeArtefactRow(String key);
    public void removeArtefact(String key);
    public Artefact findByKey(String key);
    public List<Artefact> list();
}
