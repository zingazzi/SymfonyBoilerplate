<?php

namespace AppBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class LuckyController extends Controller
{
    /**
     * @Route("//lucky/number/{count}", name="lucky_number")
     */
    public function nemberAction($count)
    {

        $numbers = array();
        for ($i=0; $i < $count; $i++) { 
            $numbers[] = rand(0,100);
        }

        $numbersList = implode(', ', $numbers);

        return $this->render(
            'lucky/number.html.twig',
            array('luckyNumberList' => $numbersList)
        );
       
    }


    public function test()
    {
        $a = 'Ciao ciao';
        return $a;
    }

}
