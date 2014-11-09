package org.wdc.dao.metadata.impl;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;
import org.wdc.dao.impl.HibernateDao;
import org.wdc.dao.metadata.MetadataKeyDao;
import org.wdc.domain.metadata.MetadataKey;

@Repository("metadatakeyDao")
public class MetadataKeyDaoImpl extends HibernateDao<MetadataKey, Integer>
                                implements MetadataKeyDao {
    @Override
    public MetadataKey findByKey(String key) {
        return (MetadataKey) currentSession().
                createCriteria(MetadataKey.class).
                add(Restrictions.eq("key", key)).
                uniqueResult();
    }
}
