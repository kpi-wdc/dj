package org.wdc.dao.metadata.impl;

import org.springframework.stereotype.Repository;
import org.wdc.dao.impl.HibernateDao;
import org.wdc.dao.metadata.MetadataKeyDefDao;
import org.wdc.domain.metadata.MetadataKeyDef;
import org.wdc.domain.metadata.ids.MetadataKeyDefId;

@Repository("metadataKeyDefDao")
public class MetadataKeyDefDaoImpl extends HibernateDao<MetadataKeyDef, MetadataKeyDefId>
                implements MetadataKeyDefDao {
}