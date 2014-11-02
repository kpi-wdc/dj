package org.wdc.dao.metadata.impl;

import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;
import org.springframework.stereotype.Repository;
import org.wdc.dao.impl.HibernateDao;
import org.wdc.dao.metadata.ArtefactDefDao;
import org.wdc.domain.metadata.Artefact;
import org.wdc.domain.metadata.ArtefactDef;
import org.wdc.domain.metadata.ids.ArtefactDefId;

@Repository("artefactDefDao")
public class ArtefactDefDaoImpl extends HibernateDao<ArtefactDef, ArtefactDefId>
                                               implements ArtefactDefDao {
    public static void main(String[] args) {
        ApplicationContext ctx = new ClassPathXmlApplicationContext("spring/persistence-config.xml");

        ArtefactDefDao artefactDefDao =
                (ArtefactDefDao) ctx.getBean("artefactDefDao");

        //Artefact artefact = new Artefact()
        System.out.println(artefactDefDao.find(new ArtefactDefId()));
    }
}