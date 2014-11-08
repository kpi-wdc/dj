package org.wdc.domain.metadata;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.transaction.annotation.Transactional;
import org.wdc.dao.metadata.ArtefactDefDao;
import org.wdc.dao.metadata.MetadataKeyDao;

import java.util.HashSet;
import java.util.Set;

import static org.junit.Assert.*;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration("classpath:spring/persistence-config.xml")
@Transactional
public class MetadataKeyTest {
    @Autowired
    private MetadataKeyDao metadataKeyDao;

    @Autowired
    private ArtefactDefDao artefactDefDao;

    @Test
    public void test() {
        MetadataKey metadataKey = new MetadataKey();
        metadataKeyDao.add(metadataKey);
        int id = metadataKey.getMetadataKeyId();
        ArtefactDef artefactDef = new ArtefactDef();
        artefactDef.setDefaultValue("test");
        artefactDefDao.add(artefactDef);
        Set<ArtefactDef> set = new HashSet<>();
        set.add(artefactDef);
        metadataKey.setArtefactDefs(set);
        metadataKeyDao.update(metadataKey);
        metadataKey = metadataKeyDao.find(id);
        set = metadataKey.getArtefactDefs();
        artefactDef = (ArtefactDef) set.toArray()[0];
        assertEquals("test", artefactDef.getDefaultValue());
    }
}