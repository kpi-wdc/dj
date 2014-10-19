package org.wdc.dao.metadata.impl;

import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;
import org.springframework.stereotype.Repository;
import org.wdc.dao.metadata.ArtefactDao;
import org.wdc.domain.metadata.Artefact;

import javax.transaction.Transactional;
import java.util.List;

/**
 * Created by vii on 18.10.14.
 */

@Repository("artefact")
public class ArtefactDaoImpl implements ArtefactDao {
    @Autowired
    private SessionFactory sessionFactory;

    @Override
    public List<Artefact> getArtefact() {
        Session session = sessionFactory.openSession();
        session.beginTransaction();
        Criteria criteria = session.createCriteria(Artefact.class);
        List<Artefact> artefacts = (List<Artefact>) criteria.list();
        session.getTransaction().commit();

/*        List<Artefact> artefacts = sessionFactory.getCurrentSession()
                    .createCriteria(Artefact.class).list();*/

        return artefacts;
    }

    public static void main(String[] args) {
        ApplicationContext ctx = new ClassPathXmlApplicationContext("spring/persistence-config.xml");

        ArtefactDaoImpl impl = (ArtefactDaoImpl) ctx.getBean("artefact");

        System.out.println(impl.getArtefact());
        //impl.getArtefact();
    }
}
