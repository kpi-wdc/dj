package org.wdc.service;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;
import org.springframework.stereotype.Service;
import org.wdc.domain.metadata.Artefact;
import org.wdc.domain.metadata.ArtefactDef;
import org.wdc.domain.metadata.MetadataKey;

import javax.transaction.Transactional;

/**
 * Created by vii on 19.10.14.
 */

@Transactional
@Service("artefactDefService")
public class ArtefactDefService {
    @Autowired
    SessionFactory sessionFactory;

    public SessionFactory getSessionFactory() {
        return sessionFactory;
    }

    public void setSessionFactory(SessionFactory sessionFactory) {
        this.sessionFactory = sessionFactory;
    }

    public void saveArtefactAndMetadataKey(Artefact artefact, MetadataKey metadataKey,
                                           boolean required, boolean unique, String defaultValue) {
        Session session = sessionFactory.getCurrentSession();

        session.beginTransaction();


        ArtefactDef artefactDef = new ArtefactDef(required, unique, defaultValue);
        artefactDef.setArtefact(artefact);
        artefactDef.setMetadataKey(metadataKey);


        session.getTransaction().commit();
    }

    public Artefact getArtefact() {
        Session session = sessionFactory.openSession();

        Artefact artefact = (Artefact) session.get(Artefact.class, 3);

        return artefact;
    }

    public static void main(String[] args) {
        ApplicationContext ctx = new ClassPathXmlApplicationContext("spring/persistence-config.xml");

        ArtefactDefService service = (ArtefactDefService) ctx.getBean("artefactDefService");

        Artefact artefact = service.getArtefact();

        for (ArtefactDef def : artefact.getArtefactDefs()) {
            System.out.println(def);
        }
    }
}
