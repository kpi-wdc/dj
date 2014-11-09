package org.wdc.service;

import org.wdc.domain.metadata.MetadataKey;

import java.util.List;

public interface MetadataKeyService {
    public void addMetadataKeyRow(String key);
    public void addMetadataKey(MetadataKey metadataKey);
    public void removeMetadataKeyRow(String key);
    public void removeMetadataKey(MetadataKey metadataKey);
    public MetadataKey findByKey(String key);
    public List<MetadataKey> list();
}
