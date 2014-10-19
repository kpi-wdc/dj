package org.wdc.dao.metadata.impl;

import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;
import org.springframework.stereotype.Repository;
import org.wdc.dao.metadata.MetadataKeyDao;
import org.wdc.domain.metadata.Artefact;
import org.wdc.domain.metadata.MetadataKey;

import java.util.List;

/**
 * Created by vii on 19.10.14.
 */

@Repository("metadatakey")
public class MetadataKeyDaoImpl implements MetadataKeyDao {
    @Autowired
    private SessionFactory sessionFactory;

    @Override
    public List<MetadataKey> getMetadataKeys() {
        Session session = sessionFactory.openSession();
        //session.beginTransaction();
        Criteria criteria = session.createCriteria(MetadataKey.class);
        List<MetadataKey> metadataKeys = (List<MetadataKey>) criteria.list();

        return metadataKeys;
    }

    public static void main(String[] args) {
        ApplicationContext ctx = new ClassPathXmlApplicationContext("spring/persistence-config.xml");

        MetadataKeyDaoImpl impl = (MetadataKeyDaoImpl) ctx.getBean("metadatakey");

        System.out.println(impl.getMetadataKeys());
        //impl.getArtefact();
    }
}
