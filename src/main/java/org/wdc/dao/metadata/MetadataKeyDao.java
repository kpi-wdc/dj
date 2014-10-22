package org.wdc.dao.metadata;

import org.wdc.domain.metadata.MetadataKey;

import java.util.List;

public interface MetadataKeyDao {
    public List<MetadataKey> getMetadataKeys();
}
