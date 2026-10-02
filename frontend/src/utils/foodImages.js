import french_fries from '../assets/food/french-fries.jpg';
import crispy_corn from '../assets/food/crispy-corn.jpg';
import gobi_manchurian from '../assets/food/gobi-manchurian.jpg';
import mushroom_manchurian from '../assets/food/mushroom-manchurian.jpg';
import paneer_tikka from '../assets/food/paneer-tikka.jpg';
import chilli_chicken from '../assets/food/chilli-chicken.jpg';
import chicken_wings from '../assets/food/chicken-wings.jpg';
import tandoori_roti from '../assets/food/tandoori-roti.jpg';
import butter_naan from '../assets/food/butter-naan.jpg';
import garlic_naan from '../assets/food/garlic-naan.jpg';
import dal_makhani from '../assets/food/dal-makhani.jpg';
import palak_paneer from '../assets/food/palak-paneer.jpg';
import chicken_curry from '../assets/food/chicken-curry.jpg';
import paneer_butter_masala from '../assets/food/paneer-butter-masala.jpg';
import kadai_chicken from '../assets/food/kadai-chicken.jpg';
import butter_chicken from '../assets/food/butter-chicken.jpg';
import mutton_rogan_josh from '../assets/food/mutton-rogan-josh.jpg';
import veg_biryani from '../assets/food/veg-biryani.jpg';
import egg_biryani from '../assets/food/egg-biryani.jpg';
import paneer_biryani from '../assets/food/paneer-biryani.jpg';
import chicken_biryani from '../assets/food/chicken-biryani.jpg';
import mutton_biryani from '../assets/food/mutton-biryani.jpg';
import prawns_biryani from '../assets/food/prawns-biryani.jpg';
import vanilla_ice_cream from '../assets/food/vanilla-ice-cream.jpg';
import gulab_jamun from '../assets/food/gulab-jamun.jpg';
import chocolate_brownie from '../assets/food/chocolate-brownie.jpg';
import new_york_cheesecake from '../assets/food/new-york-cheesecake.jpg';
import mango_lassi from '../assets/food/mango-lassi.jpg';
import mojito from '../assets/food/mojito.jpg';
import cold_coffee from '../assets/food/cold-coffee.jpg';
import masala_chai from '../assets/food/masala-chai.jpg';
import fresh_lime_soda from '../assets/food/fresh-lime-soda.jpg';

const foodImages = {
  'french-fries': french_fries,
  'crispy-corn': crispy_corn,
  'gobi-manchurian': gobi_manchurian,
  'mushroom-manchurian': mushroom_manchurian,
  'paneer-tikka': paneer_tikka,
  'chilli-chicken': chilli_chicken,
  'chicken-wings': chicken_wings,
  'tandoori-roti': tandoori_roti,
  'butter-naan': butter_naan,
  'garlic-naan': garlic_naan,
  'dal-makhani': dal_makhani,
  'palak-paneer': palak_paneer,
  'chicken-curry': chicken_curry,
  'paneer-butter-masala': paneer_butter_masala,
  'kadai-chicken': kadai_chicken,
  'butter-chicken': butter_chicken,
  'mutton-rogan-josh': mutton_rogan_josh,
  'veg-biryani': veg_biryani,
  'egg-biryani': egg_biryani,
  'paneer-biryani': paneer_biryani,
  'chicken-biryani': chicken_biryani,
  'mutton-biryani': mutton_biryani,
  'prawns-biryani': prawns_biryani,
  'vanilla-ice-cream': vanilla_ice_cream,
  'gulab-jamun': gulab_jamun,
  'chocolate-brownie': chocolate_brownie,
  'new-york-cheesecake': new_york_cheesecake,
  'mango-lassi': mango_lassi,
  'mojito': mojito,
  'cold-coffee': cold_coffee,
  'masala-chai': masala_chai,
  'fresh-lime-soda': fresh_lime_soda,
};

export const getFoodImage = (name) => {
  if (!name) return null;
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  return foodImages[slug] || null;
};
