package org.wdc.service;

import org.wdc.domain.metadata.Association;

import java.util.List;

public interface AssociationService {
    public void addKey(String artefactKey, String referenceKey, String key);
    public void addAssociation(String artefactKey, String referenceKey, String key,
                               String localField, String foreignField);
    public void updateKey(String artefactKey, String referenceKey, String newKey);
    public void updateAssociation(String artefactKey, String referenceKey, String newKey,
                                  String newLocalField, String newForeignField);
    public void removeAssociation(String artefactKey, String referenceKey);
    public Association findByKey(String key);
    public Association findByArtefactAndReferenceKey(String artefactKey, String referenceKey);
    public List<Association> list();
}
