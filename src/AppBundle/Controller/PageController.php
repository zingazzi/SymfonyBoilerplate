<?php

namespace AppBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\DateType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\Form\Extension\Core\Type\EmailType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;

use AppBundle\Controller\Interfaces;
use AppBundle\Controller\LuckyController;

use AppBundle\Entity\Page;
use AppBundle\Entity\Category;

class PageController extends Controller implements Interfaces\TestInterface
{

    /**
     * @Route("/page/create", name="page_create")
     */
    public function createAction()
    {
        $page = new Page();
        $page->setTitle('This Page 2');
        $page->setActive(1);
        $page->setDescription('<p>Fringilla deleniti aliqua laboriosam, eos anim blandit conubia habitant dictum architecto, voluptate, molestiae ac.</p>');

        $em = $this->getDoctrine()->getManager();

        // tells Doctrine you want to (eventually) save the page (no queries yet)
        $em->persist($page);

        // actually executes the queries (i.e. the INSERT query)
        $em->flush();

        return new Response('Saved new page with id '.$page->getId());
    }

    /**
     * @Route("/page/{id}", name="page_detail")
     */
    public function pageDetailAction($id)
    {
        $pageRepository = $this->getDoctrine()
            ->getRepository('AppBundle:Page');
        
        $page     = $pageRepository->find($id);
        $category = $page->getCategory();

        return $this->render(
            'page/detail.html.twig',
            compact('page', 'category')
        );
    }

    /**
     * @Route("/category/{id}", name="page_list", defaults={"id" = 0})
     */
    public function pageListAction($id)
    {
        $categoryRepository = $this->getDoctrine()
            ->getRepository('AppBundle:Category');
        $pageRepository = $this->getDoctrine()
            ->getRepository('AppBundle:Page');

        $category   = [];

        $categories = $categoryRepository->createQueryBuilder('p')
                      ->where('p.active = 1')
                      ->getQuery()
                      ->getResult();

        $query = $pageRepository->createQueryBuilder('p')
                ->innerJoin('p.category', 'ct')
                ->where('ct.active = 1 ')
                ->where('p.active = 1 ');

        if ($id != 0) {
            $query = $query->where('ct.id = :id')
                         ->setParameter('id', $id);
        }
        
        $category = $query
                    ->getQuery()
                    ->getResult();

        return $this->render(
            'page/list.html.twig',
            compact('category', 'categories', 'id')
        );
    }

    /**
     * @Route("/contact", name="contact")
     */
    public function contact()
    {
        $form = $this->createFormBuilder()
            ->add('Nome', TextType::class)
            ->add('Email', EmailType::class)
            ->add('Testo', TextareaType::class, ['required'    => false])
            ->add('dueDate', DateType::class)
            ->add('save', SubmitType::class, array('label' => 'Invia'))
            ->getForm();

        return $this->render('page/contact.html.twig', array(
            'form' => $form->createView(),
        ));
    }


    /**
     * @Route("/admin")
     */
    public function adminAction()
    {
        return new Response('<html><body>Admin page!</body></html>');
    }

    public function loud()
    {
        return 'ciao';
    }

}
