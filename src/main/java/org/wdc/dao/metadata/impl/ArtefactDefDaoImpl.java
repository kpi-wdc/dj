package org.wdc.dao.metadata.impl;

import org.springframework.stereotype.Repository;
import org.wdc.dao.impl.HibernateDao;
import org.wdc.dao.metadata.ArtefactDefDao;
import org.wdc.domain.metadata.ArtefactDef;
import org.wdc.domain.metadata.ids.ArtefactDefId;

@Repository("artefactDefDao")
public class ArtefactDefDaoImpl extends HibernateDao<ArtefactDef, ArtefactDefId>
                                               implements ArtefactDefDao {

}