package it.unibo.ledmockgui;
import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.Dimension;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.util.concurrent.TimeUnit;

import javax.swing.JButton;
import javax.swing.JFrame;
import javax.swing.JPanel;
import it.unibo.qactors.akka.QActor;

public class customGui {
	public static final boolean ledGuiOn  = true;
	public static final boolean ledGuiOff = false;
	private static final Dimension smallGui = new Dimension(20, 20);
	private static final Dimension largeGui = new Dimension(50, 50);

	private static customGui curBlsGui  = null;	//singleton
	private static customGui curLedGui  = null;	//singleton
	private static customGui curLBtnGui = null;	//singleton

		private QActor myActor;
	    private JFrame frm       = new JFrame();
	    private JPanel pnl       = new JPanel();
	    private JButton btnGui   = new JButton("Click");
	    private JPanel ledGui    = new JPanel();
	    private int count        = 1;    
	    
	    //Factory methods
	    public static synchronized customGui createcustomGui(QActor myActor) {
	    	if( curBlsGui == null ) curBlsGui = new customGui(myActor);
	     	return curBlsGui;
	    }
	    public static synchronized customGui createCustomLedGui(QActor myActor) {
	    	if( curLedGui == null ) curLedGui = new customGui(myActor, "led");
	    	return  curLedGui;
	     }
	    public static synchronized customGui createCustomButtonGui(QActor myActor) {
	    	if( curLBtnGui == null ) curLBtnGui =  new customGui(myActor, "button");
	    	return  curLBtnGui;
	    }
	    public static void setLed(QActor myActor, String value) {
	      	curLedGui.setLedGui( value.equals("on") ? true : false );
	    }
	    public static void setLedBlink(QActor myActor, String value) {
	    	//System.out.println("Set led blink: "+ value);
	      	curLedGui.startBlinkLed( value.equals("on") ? true : false );
	    }   
	    /*
	     * CONSTRUCTORS
	     */
	    public  customGui(QActor myActor) {
	    	this.myActor = myActor;
	    	initAll();
	    }
	    public  customGui(QActor myActor, String device) {
	    	this.myActor = myActor;
	    	if( device == "led") initLedGui();
	    	else if( device == "button") initButtonGui();
	    }
	    
	    protected void initAll() {
	    	initFrame("all");
			initLedGui();
			initButtonGui();
	      	System.out.println("customGui initAll done   "    );
	    }
	    
	    protected void initFrame(String device) {
	     	 pnl.setLayout( new BorderLayout() );
	         if( device == "button") {
	            pnl.setPreferredSize(new Dimension(140, 100));
	        	pnl.add( btnGui, BorderLayout.SOUTH);
	            frm.setLocation(150, 100);
	        }
	        else if( device == "led") {
	            pnl.setPreferredSize(new Dimension(140, 100));
	        	pnl.add( ledGui, BorderLayout.NORTH); 
	            frm.setLocation(350, 100);
	        }
	        else if( device == "all")  {
	          	pnl.setPreferredSize(new Dimension(340, 200));
	          	pnl.add(btnGui, BorderLayout.SOUTH);
	            pnl.add( ledGui, BorderLayout.NORTH);        	
	            frm.setLocation(350, 100);
	        }
	        frm.add(pnl, BorderLayout.CENTER);
	        frm.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE); // EDIT
	        frm.setResizable(false);
	        frm.pack();
	        frm.setVisible(true);
	        System.out.println("customGui initFrame done for " + device  );  //muActor could be null
	    }
	    
	    protected void initButtonGui() {
	    	initFrame("button");
	        btnGui.setPreferredSize(new Dimension(100, 40));
	        btnGui.addActionListener(new ActionListener() {
	             @Override
	            public void actionPerformed(ActionEvent e) {               
	                if(myActor!=null) {
	                	//myActor.println("actionPerformed " + e.getActionCommand());
	                	myActor.emit("local_click", "clicked("+count++ +")");
	                }else System.out.println("actionPerformed " + e.getActionCommand());
	             }
	        });    	  
	    }
	    
	    protected void initLedGui() {
	       	initFrame("led");
	       	ledGui.setBackground(Color.RED);
	       	ledGui.setPreferredSize(smallGui);
	       	setLedGui(ledGuiOff); 	
	    }
	    
	    public void setLedGui(boolean on) {
//	    	System.out.println("setLedGui " + on);
	     	if(on) ledGui.setSize(largeGui);
	    	else ledGui.setSize(smallGui);
	    	ledGui.repaint();
	    }
	    
	    public void startBlinkLed(boolean on) {
	    	int i = 0;
	    	System.out.println("Prima del while:" + on);
	    	while(on) {
	    		System.out.println(on);
	    		if(i%2 == 0)
	    			this.setLedGui(on);
	    		else
	    			this.setLedGui(!on);
	    		/*Da aggiustare perché un po' una porcata*/
	    		try {
					TimeUnit.SECONDS.sleep(1);
				} catch (InterruptedException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
	    		i ++;
	    	}
	    	this.setLedGui(false);	
	    }
	    /*
	     * Just to test	  
	     */    
	    public static void main(String[] args) throws InterruptedException {
	    	customGui blsGui = customGui.createcustomGui(null);  
	    	for( int i=1; i<=3; i++) {
				Thread.sleep(1000);
				blsGui.setLedGui(ledGuiOn);
				Thread.sleep(1000);
				blsGui.setLedGui(ledGuiOff);
	    	}
	    }

}
