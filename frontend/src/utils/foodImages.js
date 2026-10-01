import alfredo_pasta from '../assets/food/alfredo-pasta.jpg';
import arrabbiata_pasta from '../assets/food/arrabbiata-pasta.jpg';
import bbq_chicken_pizza from '../assets/food/bbq-chicken-pizza.jpg';
import butter_chicken from '../assets/food/butter-chicken.jpg';
import butter_naan from '../assets/food/butter-naan.jpg';
import chicken_alfredo from '../assets/food/chicken-alfredo.jpg';
import chicken_biryani from '../assets/food/chicken-biryani.jpg';
import chicken_curry from '../assets/food/chicken-curry.jpg';
import chicken_fried_rice from '../assets/food/chicken-fried-rice.jpg';
import chicken_hakka_noodles from '../assets/food/chicken-hakka-noodles.jpg';
import chicken_manchow_soup from '../assets/food/chicken-manchow-soup.jpg';
import chicken_pepperoni_pizza from '../assets/food/chicken-pepperoni-pizza.jpg';
import chicken_tikka from '../assets/food/chicken-tikka.jpg';
import chicken_wings from '../assets/food/chicken-wings.jpg';
import chicken_zinger_burger from '../assets/food/chicken-zinger-burger.jpg';
import chilli_chicken from '../assets/food/chilli-chicken.jpg';
import chocolate_brownie from '../assets/food/chocolate-brownie.jpg';
import cold_coffee from '../assets/food/cold-coffee.jpg';
import crispy_corn from '../assets/food/crispy-corn.jpg';
import crispy_veg_burger from '../assets/food/crispy-veg-burger.jpg';
import dal_makhani from '../assets/food/dal-makhani.jpg';
import double_cheese_burger from '../assets/food/double-cheese-burger.jpg';
import egg_biryani from '../assets/food/egg-biryani.jpg';
import farmhouse_pizza from '../assets/food/farmhouse-pizza.jpg';
import fish_burger from '../assets/food/fish-burger.jpg';
import fish_tikka from '../assets/food/fish-tikka.jpg';
import french_fries from '../assets/food/french-fries.jpg';
import fresh_lime_soda from '../assets/food/fresh-lime-soda.jpg';
import garlic_naan from '../assets/food/garlic-naan.jpg';
import gobi_manchurian from '../assets/food/gobi-manchurian.jpg';
import gulab_jamun from '../assets/food/gulab-jamun.jpg';
import kadai_chicken from '../assets/food/kadai-chicken.jpg';
import mac_and_cheese from '../assets/food/mac-and-cheese.jpg';
import mango_lassi from '../assets/food/mango-lassi.jpg';
import margherita_pizza from '../assets/food/margherita-pizza.jpg';
import masala_chai from '../assets/food/masala-chai.jpg';
import mushroom_manchurian from '../assets/food/mushroom-manchurian.jpg';
import mushroom_pizza from '../assets/food/mushroom-pizza.jpg';
import mutton_biryani from '../assets/food/mutton-biryani.jpg';
import mutton_rogan_josh from '../assets/food/mutton-rogan-josh.jpg';
import new_york_cheesecake from '../assets/food/new-york-cheesecake.jpg';
import palak_paneer from '../assets/food/palak-paneer.jpg';
import paneer_biryani from '../assets/food/paneer-biryani.jpg';
import paneer_butter_masala from '../assets/food/paneer-butter-masala.jpg';
import paneer_tikka from '../assets/food/paneer-tikka.jpg';
import prawns_biryani from '../assets/food/prawns-biryani.jpg';
import tandoori_roti from '../assets/food/tandoori-roti.jpg';
import test_burger from '../assets/food/test-burger.jpg';
import vanilla_ice_cream from '../assets/food/vanilla-ice-cream.jpg';
import veg_biryani from '../assets/food/veg-biryani.jpg';
import veg_fried_rice from '../assets/food/veg-fried-rice.jpg';
import veg_hakka_noodles from '../assets/food/veg-hakka-noodles.jpg';
import veg_sweet_corn_soup from '../assets/food/veg-sweet-corn-soup.jpg';

const foodImages = {
  'alfredo-pasta': alfredo_pasta,
  'arrabbiata-pasta': arrabbiata_pasta,
  'bbq-chicken-pizza': bbq_chicken_pizza,
  'butter-chicken': butter_chicken,
  'butter-naan': butter_naan,
  'chicken-alfredo': chicken_alfredo,
  'chicken-biryani': chicken_biryani,
  'chicken-curry': chicken_curry,
  'chicken-fried-rice': chicken_fried_rice,
  'chicken-hakka-noodles': chicken_hakka_noodles,
  'chicken-manchow-soup': chicken_manchow_soup,
  'chicken-pepperoni-pizza': chicken_pepperoni_pizza,
  'chicken-tikka': chicken_tikka,
  'chicken-wings': chicken_wings,
  'chicken-zinger-burger': chicken_zinger_burger,
  'chilli-chicken': chilli_chicken,
  'chocolate-brownie': chocolate_brownie,
  'cold-coffee': cold_coffee,
  'crispy-corn': crispy_corn,
  'crispy-veg-burger': crispy_veg_burger,
  'dal-makhani': dal_makhani,
  'double-cheese-burger': double_cheese_burger,
  'egg-biryani': egg_biryani,
  'farmhouse-pizza': farmhouse_pizza,
  'fish-burger': fish_burger,
  'fish-tikka': fish_tikka,
  'french-fries': french_fries,
  'fresh-lime-soda': fresh_lime_soda,
  'garlic-naan': garlic_naan,
  'gobi-manchurian': gobi_manchurian,
  'gulab-jamun': gulab_jamun,
  'kadai-chicken': kadai_chicken,
  'mac-and-cheese': mac_and_cheese,
  'mango-lassi': mango_lassi,
  'margherita-pizza': margherita_pizza,
  'masala-chai': masala_chai,
  'mushroom-manchurian': mushroom_manchurian,
  'mushroom-pizza': mushroom_pizza,
  'mutton-biryani': mutton_biryani,
  'mutton-rogan-josh': mutton_rogan_josh,
  'new-york-cheesecake': new_york_cheesecake,
  'palak-paneer': palak_paneer,
  'paneer-biryani': paneer_biryani,
  'paneer-butter-masala': paneer_butter_masala,
  'paneer-tikka': paneer_tikka,
  'prawns-biryani': prawns_biryani,
  'tandoori-roti': tandoori_roti,
  'test-burger': test_burger,
  'vanilla-ice-cream': vanilla_ice_cream,
  'veg-biryani': veg_biryani,
  'veg-fried-rice': veg_fried_rice,
  'veg-hakka-noodles': veg_hakka_noodles,
  'veg-sweet-corn-soup': veg_sweet_corn_soup,
};


export const getFoodImage = (name) => {
  if (!name) return null;
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  return foodImages[slug] || null;
};
