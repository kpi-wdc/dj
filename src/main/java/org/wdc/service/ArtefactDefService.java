package org.wdc.service;

import org.wdc.domain.metadata.ArtefactDef;

import java.util.List;

public interface ArtefactDefService {
    public void addArtefactDef(String artefactKey, String metadataKey,
                               boolean required, boolean unique, String defaultValue);
    public void updateArtefactDef(String artefactKey, String metadataKey,
                                  boolean required, boolean unique, String defaultValue);
    public void removeArtefactDef(String artefactKey, String metadataKey);
    public ArtefactDef findByArtefactAndMetadataKeys(String artefactKey, String metadataKey);
    public List<ArtefactDef> list();
}
