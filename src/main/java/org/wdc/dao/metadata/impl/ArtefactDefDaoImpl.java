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
    @Transactional(propagation = Propagation.REQUIRED)
    public static void main(String[] args) {
        ApplicationContext ctx = new ClassPathXmlApplicationContext("spring/persistence-config.xml");

        ArtefactDefDao artefactDefDao =
                (ArtefactDefDao) ctx.getBean("artefactDefDao");

        ArtefactDao artefactDao =
                (ArtefactDao) ctx.getBean("artefactDao");

        MetadataKeyDao metadataKeyDao =
                (MetadataKeyDao) ctx.getBean("metadataKeyDao");

        Artefact artefact = artefactDao.findByKey("key1");
        System.out.println("artefact id=" + artefact.getArtefactId());

        MetadataKey metadataKey = metadataKeyDao.findByKey("wdc.objectgroup.name.ua");
        System.out.println("metadatakey id=" + metadataKey.getMetadataKeyId());


        System.out.println(artefactDefDao.find(new ArtefactDefId(artefact, metadataKey)));
    }
}