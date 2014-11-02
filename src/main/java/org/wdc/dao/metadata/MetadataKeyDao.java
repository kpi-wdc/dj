package org.wdc.dao.metadata;

import org.wdc.dao.GenericDao;
import org.wdc.domain.metadata.MetadataKey;

public interface MetadataKeyDao extends GenericDao<MetadataKey, Integer> {
    public MetadataKey findByKey(String key);
}
