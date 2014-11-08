package org.wdc.dao.metadata.impl;

import org.hibernate.Hibernate;
import org.hibernate.criterion.Restrictions;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.wdc.dao.impl.HibernateDao;
import org.wdc.dao.metadata.ArtefactDao;
import org.wdc.dao.metadata.ArtefactDefDao;
import org.wdc.dao.metadata.MetadataKeyDao;
import org.wdc.domain.metadata.Artefact;
import org.wdc.domain.metadata.ArtefactDef;
import org.wdc.domain.metadata.MetadataKey;
import org.wdc.domain.metadata.ids.ArtefactDefId;

@Repository("artefactDefDao")
public class ArtefactDefDaoImpl extends HibernateDao<ArtefactDef, ArtefactDefId>
                                               implements ArtefactDefDao {

}