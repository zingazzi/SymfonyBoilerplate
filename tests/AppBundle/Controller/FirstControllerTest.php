<?php

namespace Tests\AppBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use AppBundle\Controller;

class FirstControllerTest extends \PHPUnit_Framework_TestCase
{
    public function testLoudExample()
    {
        $calc = new TestController;
        $result = $calc->loud();

        // assert that your calculator added the numbers correctly!
        $this->assertEquals('Hello', $result);

    }
}
