package org.wdc.service;

import org.junit.Ignore;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.Assert.*;

@Ignore
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration("classpath:spring/persistence-config.xml")
@Transactional(propagation = Propagation.REQUIRED, readOnly = false)
public class AssociationServiceTest {

    @Test
    public void testAddKey() throws Exception {

    }

    @Test
    public void testAddAssociation() throws Exception {

    }

    @Test
    public void testUpdateKey() throws Exception {

    }

    @Test
    public void testUpdateAssociation() throws Exception {

    }

    @Test
    public void testRemoveAssociation() throws Exception {

    }

    @Test
    public void testFindByKey() throws Exception {

    }

    @Test
    public void testFindByArtefactAndReferenceKey() throws Exception {

    }

    @Test
    public void testList() throws Exception {

    }
}