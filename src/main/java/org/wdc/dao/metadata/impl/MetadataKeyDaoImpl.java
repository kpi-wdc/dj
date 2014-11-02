package org.wdc.dao.metadata.impl;

import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;
import org.springframework.stereotype.Repository;
import org.wdc.dao.impl.HibernateDao;
import org.wdc.dao.metadata.MetadataKeyDao;
import org.wdc.domain.metadata.MetadataKey;

@Repository("metadatakeyDao")
public class MetadataKeyDaoImpl extends HibernateDao<MetadataKey, Integer>
                                implements MetadataKeyDao {
    public static void main(String[] args) {
        ApplicationContext ctx = new ClassPathXmlApplicationContext("spring/persistence-config.xml");

        MetadataKeyDao metadataKeyDao = (MetadataKeyDao) ctx.getBean("metadatakeyDao");

        System.out.println(metadataKeyDao.list());
    }
}
