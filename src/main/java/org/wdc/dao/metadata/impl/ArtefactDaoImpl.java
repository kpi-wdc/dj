package org.wdc.dao.metadata.impl;

import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;
import org.springframework.stereotype.Repository;
import org.wdc.dao.impl.HibernateDao;
import org.wdc.dao.metadata.ArtefactDao;
import org.wdc.domain.metadata.Artefact;

@Repository("artefactDao")
public class ArtefactDaoImpl extends HibernateDao<Artefact, Integer>
                             implements ArtefactDao {
    public static void main(String[] args) {
        ApplicationContext ctx = new ClassPathXmlApplicationContext("spring/persistence-config.xml");

        ArtefactDao artefactDao = (ArtefactDao) ctx.getBean("artefactDao");

        System.out.println(artefactDao.list());
    }
}
