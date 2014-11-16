package org.wdc.service;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.wdc.exception.DuplicateIdException;

import static org.junit.Assert.*;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration("classpath:spring/persistence-config.xml")
@Transactional(propagation = Propagation.REQUIRED, readOnly = false)
public class ArtefactDefServiceTest {
    @Autowired
    ArtefactDefService artefactDefService;

    @Test(expected = DuplicateIdException.class)
    public void testAddArtefactDefException() throws DuplicateIdException {
        artefactDefService.addArtefactDef("key2", "wdc.object.name.en", true, true, null);
    }

    @Test
    public void testUpdateArtefactDef() throws Exception {

    }

    @Test
    public void testRemoveArtefactDef() throws Exception {

    }

    @Test
    public void testFindByArtefactAndMetadataKeys() throws Exception {

    }

    @Test
    public void testList() throws Exception {

    }
}