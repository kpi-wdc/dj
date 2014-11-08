package org.wdc.dao.metadata.impl;

import org.springframework.stereotype.Repository;
import org.wdc.dao.impl.HibernateDao;
import org.wdc.dao.metadata.ArtefactMetadataDao;
import org.wdc.domain.metadata.ArtefactMetadata;
import org.wdc.domain.metadata.ids.ArtefactMetadataId;

@Repository("artefactMetadataDao")
public class ArtefactMetadataDaoImpl extends HibernateDao<ArtefactMetadata,
                        ArtefactMetadataId> implements ArtefactMetadataDao {
}