package org.wdc.dao.metadata;

import org.wdc.domain.metadata.MetadataKey;

import java.util.List;

/**
 * Created by vii on 19.10.14.
 */
public interface MetadataKeyDao {
    public List<MetadataKey> getMetadataKeys();
}
