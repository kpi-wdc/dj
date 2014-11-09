package org.wdc.service;

import org.wdc.domain.metadata.ArtefactMetadata;

import java.util.List;

public interface ArtefactMetadataService {
    public void addArtefactMetadata(String artefactKey, String metadataKey, String value);
    public void updateArtefactMetadata(String artefactKey,
                                       String metadataKey, String newValue);
    public void removeArtefactMetadata(String artefactKey, String metadataKey);
    public ArtefactMetadata findByArtefactAndMetadataKeys(String artefactKey,
                                                          String metadataKey);
    public List<ArtefactMetadata> list();
}
