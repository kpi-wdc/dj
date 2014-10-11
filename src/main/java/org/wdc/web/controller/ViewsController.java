package org.wdc.web.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Controller
@RequestMapping("/")
public class ViewsController {

    @RequestMapping(method = RequestMethod.GET)
    public String prepare(ModelMap model) {
        model.addAttribute("home", "page");
        model.addAttribute("it", "is");
        return "index";
    }
}