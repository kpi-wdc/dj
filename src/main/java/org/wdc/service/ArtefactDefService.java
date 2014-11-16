package org.wdc.service;

import org.wdc.domain.metadata.ArtefactDef;
import org.wdc.exception.DuplicateIdException;
import org.wdc.exception.NoIdException;

import java.util.List;

public interface ArtefactDefService {
    public void addArtefactDef(String artefactKey, String metadataKey,
                boolean required, boolean unique, String defaultValue)
            throws DuplicateIdException;

    public void updateArtefactDef(String artefactKey, String metadataKey,
                boolean required, boolean unique, String defaultValue)
            throws NoIdException;

    public void removeArtefactDef(String artefactKey, String metadataKey)
            throws NoIdException;

    public ArtefactDef findByArtefactAndMetadataKeys(String artefactKey, String metadataKey);
    public List<ArtefactDef> list();
}
