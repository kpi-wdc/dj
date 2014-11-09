package org.wdc.service;

import org.wdc.domain.metadata.MetadataKeyDef;

import java.util.List;

public interface MetadataKeyDefService {
    public void addMetadataKeyDef(String metadataKey, String defKey, String value);
    public void updateMetadataKeyDef(String metadataKey, String defKey, String newValue);
    public void removeMetadataKeyDef(String metadataKey, String defKey);
    public MetadataKeyDef findByMetadataKeyAndDefKeys(String metadataKey, String defKey);
    public List<MetadataKeyDef> list();
}
